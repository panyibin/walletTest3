//
//  UIView+Yibin.m
//  ShadowTest
//
//  Created by panyibin on 2018/2/1.
//  Copyright © 2018年 yidian. All rights reserved.
//

#import "UIView+Yibin.h"
#import <objc/runtime.h>

@implementation UIView (Yibin)

- (void)yb_addShadow {
    self.layer.shadowColor = [UIColor blackColor].CGColor;
    self.layer.shadowOpacity = 0.3;
    self.layer.shadowOffset = CGSizeMake(2, 2);
}

- (void)yb_addShadowForAllSides {
    CGFloat shadowSize = 2;
    UIBezierPath *path = [UIBezierPath bezierPathWithRect:CGRectMake(-shadowSize,
                                                                     -shadowSize,
                                                                     self.frame.size.width + shadowSize * 2,
                                                                     self.frame.size.height + shadowSize * 2)];
    
    self.layer.shadowPath = path.CGPath;
    self.layer.shadowColor = [UIColor blackColor].CGColor;
    self.layer.shadowOpacity = 0.3;
    self.layer.shadowOffset = CGSizeMake(0, 0);
}

@end
